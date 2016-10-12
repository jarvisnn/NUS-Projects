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

Quick, dirty steps:

1. Find PHPMini.zip, install the PHP compiler. the file README in the zip file 
should be some help. For more information/latest version of PHP compiler, visit
http://www.php.net

2. Edit fse_config.php, follow the inline comments to set up the environment and
parameters for your own use.

3. Under DOS prompt, type:
>PHP fs.php 
for feature selection
then,
>PHP fe.php
for feature extraction

You also can use the Run5News.bat batch command under C:\ directly.

* You probably want to tweak the term weighting methods as in fe.php
  Find lines that I have highlighted in the source and you won't miss them :D

* Scripts workable with web server as well. Read more from http://www.php.net.

