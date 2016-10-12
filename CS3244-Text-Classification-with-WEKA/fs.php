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
	
		//parse configurations
	if ($fs_training_portion_only) {
		$fs_scan_dir = array($trn_dir);
	} else	{
		$fs_scan_dir = array($trn_dir, $tst_dir);
	}
	
		//read in the stop list
	echo "Reading stop list ... ";
	$stop_list = array();
	$line_buffer = file($stop_list_file);
	$line_num = count($line_buffer);
	$word_counter = 0;
	for ($i = 0; $i < $line_num; $i++)	{
		if (trim($line_buffer[$i]) != "")	{
			$stop_list[] = trim($line_buffer[$i]);
			$word_counter++;
		}
	}
	echo "$word_counter words read. $NL";
	
	
	$cat_num = count($cat_dir);
	
		//init the document counter of each category
	for ($i = 0; $i < $cat_num; $i++)	{
		$doccounter[$i] = 0;
	}
	

	for ($c = 0; $c < $cat_num; $c++)	{
		
		for ($d = 0; $d < count($fs_scan_dir); $d++)	{
			$current_dir = $root_dir . $cat_dir[$c] . $fs_scan_dir[$d];

			echo "Processing $current_dir ... $NL";
			flush();
		
			$hd = opendir($current_dir);
			
			while(($file = readdir($hd)) != FALSE)    {
				$current_file = $current_dir . "/" . $file;
				
	            if (is_file($current_file))    {
					
					$local_termlist = get_term_from_file($current_file);
			
				
					$df_flag = array();
					
					for ($i=0; $i < count($local_termlist); $i++)	{
						
						//if the current term is in stop list, discard
						if (in_array($local_termlist[$i], $stop_list)) continue;
						
						
						//update the document frequency of each term, in each category
						if (!isset($term_df[$local_termlist[$i]]))	{
							for ($j = 0; $j < $cat_num; $j++)	{
								$term_df[$local_termlist[$i]][$j] = 0;
							}
						}
						//make sure the term is counted for once only
						if (!isset($df_flag[$local_termlist[$i]]))	{	
							$term_df[$local_termlist[$i]][$c]++;
							
							$df_flag[$local_termlist[$i]] = TRUE;
						}
					}
					//now that the document has been processed, increment the number of the positive/negative
					//document
					$doccounter[$c]++;
					echo ". " ;
					flush();
				}
			}
			echo $NL;
			closedir($hd);
			flush();
		}
		echo $cat_dir[$c] . " " . $doccounter[$c] . " files done. $NL";
	}
	
	//now we get one important distribution matrix:
	//* each line is idexed by an unique term,
	//* each line contains the document frequency of that term, in different categories
	//and one important index
	//* the total number of documents in each category 

		//output the term list file
	echo "Writing full term list ... ";
	ksort($term_df);
	reset($term_df);
	$fp = fopen($root_dir . $output_dir . "/" . $termlist_file, "w");
	if (!$fp)	{
		echo "Failed to create file $termlist_file. $NL";
		exit;
	}
	
	while (list($term, $df) = each($term_df))	{
		fwrite($fp, sprintf("%30s ", $term));
		for ($c = 0; $c < $cat_num; $c++)	{
			fwrite($fp, sprintf("%5d ", $df[$c]));
		} 
		fwrite ($fp, "\n");
	}
	fclose($fp);
	echo "Done $NL";
	flush();

	//next step, setting each category as POSITIVE category, while remaining as NEGATIVE category
	//and find the keywords for the positive category
	
	echo "Calculating CHI values and IDF values (may take long time) ... ";
	flush();
	
	for ($c = 0; $c < $cat_num; $c++)	{
		//calculate the CHI value of each term
		reset($term_df);
		while (list($term, $df) = each($term_df))	{
			//document frequency in positive category
			$pwith = $df[$c];
			//complementary counter
			$pnowith = $doccounter[$c] - $pwith;
			
			//document frequency in negative category
			//and complementary counter
			$nwith = 0;
			$nnowith = 0;
			for ($cc = 0; $cc < $cat_num; $cc++)	{
				if ($cc != $c) {
					$nwith += $df[$cc];
					$nnowith += $doccounter[$cc] - $nwith;
				}
			}
				//use simple term frequncy threshod to delete outlier terms
				//(save time for sorting list)		
			if (($nwith + $nnowith) < $fse_negative_tf_threshold 
				|| ($pwith + $pnowith) < $fse_positive_tf_threshold) {
				unset($term_df[$term]);
				continue;
			}
	
				//CHI statistics
			$norm = ($pwith+$nwith)*($pnowith+$nnowith)*($pwith+$pnowith)*($nwith+$nnowith);
			if (sqrt($norm) == 0) $local_chi = 0;
			else $local_chi = ($pwith*$nnowith - $nwith*$pnowith) 
							* sqrt((float)($pwith+$pnowith+$nwith+$nnowith)) 
							/ sqrt((float)$norm);
				   
			
			
			if ($fs_use_absolute_chi) {
				$chi[$c]["$term"] = abs($local_chi);
			} else	{
				$chi[$c]["$term"] = $local_chi;
			}
			
			
				/************************************
				*     IF YOU WANT TO TWEAK THE TERM WEIGHTING METHOD
				*     THIS MAY BE PART OF THE PLACES
				*     ALSO SEE fe.php HOW IDF IS USED FOR TERM WEIGHTING
				************************************/
				//Inverse Document Frequency
				//need to calculate once only
			if ($c == 0)	{
				$local_idf = log(($pwith + $nwith + $pnowith + $nnowith)
							/
							($pwith + $nwith))
						/ log(2);
				
				$term_idf["$term"] = $local_idf;
			
			}	
		} /* end while(list...)*/
	} /* end for ($c) iteration */
	
	echo "Done $NL";
	
		//now we get the CHI matrix:
		//* each line is indexed by an unique term
		//* each line contains a vector for the CHI values associated with each category
		//and the inverse document frequency of each term in a vector
		
	
		//sort the CHI values and output keywords
	echo "Writing keyword lists ... ";
	
	$term_count = count($term_idf);
	for ($c = 0; $c < $cat_num; $c++)	{

		arsort($chi[$c]); /* Sort an array in reverse order and maintain index association */
		reset($chi[$c]);  /* Set the internal pointer of an array to its first element */
		$fp = fopen($root_dir . $output_dir . "/" . $cat_dir[$c] . $keywordlist_file_ext, "w");
		if (!$fp) {
			echo "Failed to create keyword list file for write. $NL";
			exit;
		}
		
		$top_num = 0;
		while(list($term, $local_chi) = each($chi[$c]))	{
			
			$top_num++;
			
			if ($fs_by_threshold && $local_chi < $fs_chi_threshold) break;
			if (!$fs_by_threshold && $top_num > $fs_top_num) break;
			
			
			if (!isset($global_keywords_idf[$term])) {
				$global_keywords_idf[$term] = $term_idf[$term];
			}
			fwrite($fp, sprintf("%30s %2.6f %2.6f\n",
								$term,
								$term_idf[$term],
								$chi[$c]["$term"]));
		}

		fclose($fp);	
	}
	
		//now we also get a list of global keywords
	ksort($global_keywords_idf);
//	reset($global_keywrods_idf);
	
	$fp = fopen($root_dir . $output_dir . "/all" . $keywordlist_file_ext, "w");
	if (!$fp) {
		echo "Failed to create keyword list file for write. $NL";
		exit;
	}
	
	while(list($keyword, $keyword_idf) = each($global_keywords_idf))	{
		fwrite($fp, sprintf("%30s %2.6f\n", $keyword, $keyword_idf));
	}
	fclose($fp);
	
	echo "Done. $NL";
	
	echo $NL . "ALL feature selection DONE.";

?>
