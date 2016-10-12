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
if(!defined("FSE_COMMON_PHP"))	{
	define("FSE_COMMON_PHP", TRUE);


	function get_term_from_file($current_file)	{
		
		include("fse_config.php");
		
		$post_text = implode (" ", file($current_file));
						
		$post_text = eregi_replace("[^_0-9a-z-]", " ", strtolower($post_text));
		
		//explode by blank to generate token list
		$local_termlist = explode(" ", $post_text);
		
		for ($i=0; $i < count($local_termlist); $i++)	{
		
			//further striping
			$local_termlist[$i] = trim($local_termlist[$i]);
	
			//trim leading and tailing "-", "_"
			while(substr($local_termlist[$i], 0, 1) == "-" 
				|| substr($local_termlist[$i], 0, 1) == "_")
				$local_termlist[$i] = substr($local_termlist[$i], 1);
				
			while(substr($local_termlist[$i], -1) == "-" 
				|| substr($local_termlist[$i], -1) == "_")
				$local_termlist[$i] = substr($local_termlist[$i], 0, strlen($local_termlist[$i]) - 1);
			
			//if exclude digits, but the term concludes digit(s), then discard
			//if the term does not contain any a-z character discard
			if ($fse_exclude_digit && eregi("[0-9]", $local_termlist[$i])) continue;
			
			if (eregi("[a-z]", $local_termlist[$i]) && strlen($local_termlist[$i]) >= $fse_min_len)
				$term_list[] = $local_termlist[$i];
		}
		
		sort($term_list);
		return $term_list;
	}	


}		

?>