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

		//new line for command line
	$NL = "\n";
		//for web application
	//$NL = "<br>\n";

		//input settings
		//the root dir of the corpus
	$root_dir = "./5Newsgroups/";
	
		//the file location of the stop list
		//relative to the script dir, or a absolute location
	//$stop_list_file = "d:/phd/corpus/script/stoplist.txt";
	$stop_list_file = "./stoplist.txt";
	
		//list of category directories, RELATIVE TO THE CORPUS ROOT DIR
	$cat_dir = array("00_comp.graphics",
					 "01_comp.os.ms-windows.misc",
					 "02_comp.sys.ibm.pc.hardware",
					 "03_comp.sys.mac.hardware",
					 "04_comp.windows.x"
					 ); 
    	//define of training/testing sub directories, RELATIVE TO *EACH* 
    	//OF THE CATEGORY DIRECTORIES ABOVE
    $trn_dir = "/train";
    $tst_dir = "test";
	/////////////////////////////////////////////////////
	//common parameters for feature selection/extraction
	/////////////////////////////////////////////////////
		//terms with two low term frequency will be ignored
		//thresholds are given to positive and negative cases
		//separately as the negative category normally contains
		//larger number of documents than the positive one
	$fse_positive_tf_threshold = 3;
	$fse_negative_tf_threshold = 6;
		//whether allow digits in the keyword (e.g. 1st, 2nd, 2002 etc)
	$fse_exclude_digit = TRUE;
		//minimal string length of keyword
		//len("ok") = 2; len("test") = 4;
	$fse_min_len = 4;
    
    ///////////////////////////////////	
    //parameters for feature selection
    ///////////////////////////////////
    	//for categorization problem, use training portion only during feature selection
    	//otherwise you may use training + testing portion for feature selection
	$fs_training_portion_only = TRUE;
	
		//whether use CHI or ||CHI|| during feature selection
		//if CHI is used, only "good" keywords from each *positive* category
		//are selected
		//otherwise, "good" keywords from both positive and negative categories
		//are selected
	$fs_use_absolute_chi = TRUE;
		//feature selection by chi threshold or by # of top-ranked terms
		//if = TRUE, by threshold, otherwise, by # of top-ranked terms
	$fs_by_threshold = FALSE;
	$fs_chi_threshold = 15;
		//if not by threshold, pick up the top num of terms in each caterogy
		//as the keywords

		
///////////////////////////////////////////////////////////////
//                        ATTENTION!!!                       //  
//  The following is the unique parameter you may change     //
//                                                           //
///////////////////////////////////////////////////////////////

	$fs_top_num = 200;


    ///////////////////////////////////	
    //parameters for feature estraction
    ///////////////////////////////////
		//whether exclude null vectors from the feature file
	$fe_exclude_null_vector = TRUE;
		//the base of attribute index
		//either 0 or 1
		//output example for base 0:
		//0 0:0.00345 9:0.34526
		//output example for base 1:
		//0 1:0.00345 10:0.34526
	$fe_index_base = 0;
		//L1-normalize or L2-normalize the output vector
	//$fe_norm_level = 1;
	$fe_norm_level = 2;
	
	//////////////////////
	//OUTPUT settings
	//Generally dun need to modify
	//////////////////////
	
		//the output dir to store keywords/terms/features
		//relative to the corpus root
		//*** MAKE SURE IT EXISTS BEFORE YOU RUN THE SCRIPTS
	$output_dir = "/output";
	
		//dun need to modify
	$termlist_file = "terms.txt";
	$keywordlist_file_ext = "_keywords.txt";
	
		//files for features
	$trn_feature_file = "train.txt";
	$tst_feature_file = "test.txt";
		//files for list of original documents
	$trn_list_file = "list_train.txt";
	$tst_list_file = "list_test.txt";

	
//}
?>
