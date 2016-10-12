<?php
/**********************************************************
*  PHP Scripts for Text Feature Selection and Extraction  *
*                    Using CHI Statistics                 *
*                                                         *
*   Copyright (C) 2006 Lan Man (lanman@comp.nus.edu.sg)   *
*                                                         *
*  This Program is Part of the Author's Ph.D Project      *
*                                                         *
*    =============== DISCLAIMATION ==============         *
*  Permission to use, copy, modify and distribute this    *
*  program is hereby granted without fee, provided that   *
*  [1]this program is used for educational and research   *
*  purpose only and [2]this copyright notice appear in    *
*  all copies and both the copyright notice and the per-  *
*  mission notice appear in supporting documentation.     *
*  If the source code of the program is modified or en-   *
*  hanced, the source code must be made public and it     *
*  must be clearly mentioned in the documentation what    *
*  was modified. Unauthorized use of any part of this     *
*  program for any commercial purpose STRICTLY PROHIBITED *
*                                                         *
**********************************************************/

	include("fse_config.php");
	include("fse_common.php");
	
	if (!is_dir($root_dir . $output_dir))	{
		echo "Output directory " . $root_dir . $output_dir 
			 . " does not exist. Please create such a empty directory first. $NL";
		exit;
	}	
	
	//step 1: read in keyword list file
	echo "Reading keyword list...  ";

	$keyword_list_lines = file($root_dir . $output_dir . "/all" . $keywordlist_file_ext);
	$keyword_num = count($keyword_list_lines);
	
	for ($i = 0; $i < $keyword_num; $i++)	{
		$keyword_list_lines[$i] = trim($keyword_list_lines[$i]);
		
		while(ereg("  ", $keyword_list_lines[$i])) {
			$keyword_list_lines[$i] = str_replace("  ", " ", $keyword_list_lines[$i]);
		}
			
		$buffer = explode(" ", $keyword_list_lines[$i]); /* Split a string by string into a array $buffer */
		if (isset($buffer[0]) && trim($buffer[0]) != "" 
			&& isset($buffer[1]) && trim($buffer[1]) != "")	{
			$keywords[] = trim($buffer[0]);
			$idf[] = trim($buffer[1]);
		}	
	}
	$keyword_num = count($keywords);
	echo "$keyword_num read. $NL";
	flush();
	
	unset($keyword_list_lines); /* destroys the specified variables because no use later */

	//open files for writing
	$fp_feature_train = fopen($root_dir . $output_dir . "/" . $trn_feature_file, "w");
	if (!$fp_feature_train)	{
		echo "Failed to create training feature file. $NL";
		exit;
	}

	//open files for writing
	$fp_feature_test = fopen($root_dir . $output_dir . "/" . $tst_feature_file, "w");
	if (!$fp_feature_test)	{
		echo "Failed to create testing feature file. $NL";
		exit;
	}


	$fp_list_train = fopen($root_dir . $output_dir . "/" . $trn_list_file, "w");
	if (!$fp_list_train)	{
		echo "Failed to create training list file. $NL";
		exit;
	}


	$fp_list_test = fopen($root_dir . $output_dir . "/". $tst_list_file, "w");
	if (!$fp_list_test)	{
		echo "Failed to create testing list file $NL";
		exit;
	}


	//step 2: scan the corpus 
	
	$fs_scan_dir = array($trn_dir, $tst_dir);	
	$cat_num = count($cat_dir);

	//init the document counter of each category
	for ($i = 0; $i < $cat_num; $i++)	{
		$doccounter[$i] = 0;
		$nullcounter[$i] = 0;
	}

	// init the document counter of test category
	$testdoc = 0;
	$testnul = 0;

	for ($d = 0; $d < count($fs_scan_dir); $d++)	{	
		if ($d == 0) { // d==0 is train files
		$fp_list = $fp_list_train;
		$fp_feature = $fp_feature_train;

		for ($c = 0; $c < $cat_num; $c++)	{			
		
			$current_dir = $root_dir . $cat_dir[$c] . $fs_scan_dir[$d];
			
			echo "Processing $current_dir ... $NL";
			flush();
		
			$hd = opendir($current_dir);
			
			while(($file = readdir($hd)) != FALSE)    {

				$current_file = $current_dir . "/" . $file;
				
	            if (is_file($current_file))    {
					$doccounter[$c]++;
						            	
	            	//initialize term_frequency vector
					for ($i = 0; $i < $keyword_num; $i++)	{
						$tf[$i] = 0;
					}
	            	
	            	$local_termlist = get_term_from_file($current_file);		
				
					for ($i = 0; $i < count($local_termlist); $i++)	{
											
						//detect whether this term is a keyword
						if (in_array($local_termlist[$i], $keywords))	{
							//find the index of this key
							$index = array_search($local_termlist[$i], $keywords);
							$tf[$index]++;
						}
					}

					//term weighting and normalization						
					$maxtw = 0.0;
					$l2norm = 0.0;
					for ($j = 0; $j < $keyword_num; $j++)	{
						

						/************************************
						*     IF YOU WANT TO TWEAK THE TERM WEIGHTING METHOD
						*     THIS IS THE RIGHT PLACE
						*     ALSO SEE fs.php FOR CALCULATION OF IDF
						************************************/
							//TF*IDF for term weighting							
						if ($tf[$j] == 0) $tw[$j] = 0;
						else $tw[$j] = $tf[$j] * $idf[$j];
							//get the max value
						if ($tw[$j] > $maxtw) $maxtw = $tw[$j];
							//summed squre
						if ($tw[$j] != 0) $l2norm += $tw[$j] * $tw[$j];
					}
					
					//if it is a null vector and $fe_exclude_null_vector = true
					//skip 
					if ($maxtw == 0)	{
						$nullcounter[$c]++;
						if ($fe_exclude_null_vector) continue;
					}

					//l2norm
					$l2norm = sqrt($l2norm);
				
					//write training/testing list file
					fwrite($fp_list, $file . "\n");
					
					//write training/testing feature
					//write class label
					if ($d == 0) { // $d =0 means train; 
						fwrite($fp_feature, sprintf("%d", $c));
					} 					

					for ($j=0; $j < $keyword_num; $j++)	{
						if ($maxtw > 0) {
								//L1-normalization
							if ($fe_norm_level == 1) $norm = $tw[$j] / $maxtw;
								//L2-normalization
							else $norm = $tw[$j] / $l2norm;
							
						} else {
							$norm = 0;
						}
					
						//write list
						if ($norm > 0) fwrite($fp_feature, sprintf(" %d:%1.6f", $j + $fe_index_base, $norm));
					}	

					fwrite($fp_feature, "\n");
					echo ". ";
					flush();

				} // end if (isfile)

			} // end while(each file)

		echo $cat_dir[$c] . " " . $doccounter[$c] . " files done. " . $nullcounter[$c] . " null vectors. $NL";
		closedir($hd);
		flush();

		} // end for (category)

		}// end if (d==0)
		 if ($d == 1){ // d==1 is test files
			$fp_list = $fp_list_test;
			$fp_feature = $fp_feature_test;
			$current_dir = $root_dir . $fs_scan_dir[$d];
			
	//		$current_dir = $root_dir . $cat_dir[$c] . $fs_scan_dir[$d];
			
			echo "Processing $current_dir ... $NL";
			flush();
		
			$hd = opendir($current_dir);
			
			while(($file = readdir($hd)) != FALSE)    {
				$current_file = $current_dir . "/" . $file;
				
	            if (is_file($current_file))    {
					$testdoc++;
						            	
	            	//initialize term_frequency vector
					for ($i = 0; $i < $keyword_num; $i++)	{
						$tf[$i] = 0;
					}
	            	
	            	$local_termlist = get_term_from_file($current_file);
		
				
					for ($i = 0; $i < count($local_termlist); $i++)	{
											
						//detect whether this term is a keyword
						if (in_array($local_termlist[$i], $keywords))	{
							//find the index of this key
							$index = array_search($local_termlist[$i], $keywords);
							$tf[$index]++;
						}
					}

					//term weighting and normalization						
					$maxtw = 0.0;
					$l2norm = 0.0;
					for ($j = 0; $j < $keyword_num; $j++)	{
						

						/************************************
						*     IF YOU WANT TO TWEAK THE TERM WEIGHTING METHOD
						*     THIS IS THE RIGHT PLACE
						*     ALSO SEE fs.php FOR CALCULATION OF IDF
						************************************/
							//TF*IDF for term weighting							
						if ($tf[$j] == 0) $tw[$j] = 0;
						else $tw[$j] = $tf[$j] * $idf[$j];
							//get the max value
						if ($tw[$j] > $maxtw) $maxtw = $tw[$j];
							//summed squre
						if ($tw[$j] != 0) $l2norm += $tw[$j] * $tw[$j];
					}
					
					//if it is a null vector and $fe_exclude_null_vector = true
					//skip 
					if ($maxtw == 0)	{
						$testnul++;
						if ($fe_exclude_null_vector) continue;
					}

					//l2norm
					$l2norm = sqrt($l2norm);
				
					//write training/testing list file
					fwrite($fp_list, $file . "\n");
					
					//write training/testing feature
					//write class label
					

					for ($j=0; $j < $keyword_num; $j++)	{
						if ($maxtw > 0) {
								//L1-normalization
							if ($fe_norm_level == 1) $norm = $tw[$j] / $maxtw;
								//L2-normalization
							else $norm = $tw[$j] / $l2norm;
							
						} else {
							$norm = 0;
						}
					
						//write list
						if ($norm > 0) fwrite($fp_feature, sprintf(" %d:%1.6f", $j + $fe_index_base, $norm));
					}	
					
					fwrite($fp_feature, "\n");
					echo ". ";
					flush();
				}//end if(isfile)
			} // end while(each file)
		
		echo $tst_dir. "/ ".$testdoc . " files done. " . $testnul . " null vectors. $NL";
		closedir($hd);
		flush();
		 
		 }// end if(d==1)

	} //end for(d=0 to 1)

	fclose($fp_feature_train);
	fclose($fp_feature_test);
	fclose($fp_list_train);
	fclose($fp_list_test);

// delete terms, all-keywords, and all keywords file per category

/*
$termsfile = $root_dir . $output_dir . "/" . $termlist_file;
unlink($termsfile);

	// unset($root_dir . $output_dir . "/all" . $keywordlist_file_ext);
for ($c = 0; $c < $cat_num; $c++)	{
	$keywords_category = $root_dir . $output_dir . "/" . $cat_dir[$c] . $keywordlist_file_ext;
	unlink($keywords_category);
}

*/

echo $NL . "ALL feature extraction DONE.";


?>