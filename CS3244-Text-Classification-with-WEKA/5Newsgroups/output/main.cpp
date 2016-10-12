// This file is used to output the specified data format for final
// training files and testing files;

// For libsvm-2.6 the data format is:
// <label> <index1>:<value1> <index2>:<value2> ...
// where the index is from 1;

// For weka sparse, the data format is:
// @ RELATION reuters-top10
// @ ATTRIBUTE fea0 NUMERIC
// @ ATTRIBUTE class {+1, -1}
// @ DATA
//{index1 value1, index3 value3, index100 +1}
#include <iostream>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <iostream>
#include <set>
#include <string>
#include <math.h> 
//#include <direct.h>

using namespace std;
//#define k 10
//#define fea_no 86
//#define cat_no 10

void read(const unsigned int& fea_no,const bool& train)
{

	char dirweka[] = "./";
	char dirinput[] = "./";
	std::string type;
	if(train){
		type = "train";
	} else {
		type="test";
	} 

	printf("Convert formatting %s.txt file ", type.c_str());
	// produce the typec file name
	char infile[200] ;
	int j = sprintf(infile, "%s", dirinput);
	j += sprintf(infile + j, "%s", type.c_str());
	//j += sprintf(infile + j, "%d", ci);
	j += sprintf(infile + j, "%s", ".txt");
	FILE *finfile = fopen(infile, "r");
	if(!finfile){
		std::cout<<__FILE__<<__LINE__<<" Error reading "<<infile<<std::endl;
		throw;
	}

	char outfile[200];
	j = sprintf(outfile, "%s", dirweka);
	j += sprintf(outfile + j, "%s", type.c_str());
	//j += sprintf(outfile + j, "%d", ci);
	j += sprintf(outfile + j, "%s", ".arff");
	FILE *foutfile = fopen(outfile, "w");
	// write the standard weka common part
	if(train){
		fprintf(foutfile, "@RELATION 5Newsgroups-train\n");
	} else {
		fprintf(foutfile, "@RELATION 5Newsgroups-test\n");
	}

	for (int k = 0; k < fea_no; k++){
		fprintf(foutfile, "@ATTRIBUTE fea%d NUMERIC\n", k);
	}
	fprintf(foutfile, "@ATTRIBUTE class {0, 1, 2, 3, 4}\n");
	fprintf(foutfile, "@DATA\n");
	char linebuf[509600];
	memset(&linebuf, ' ', 509600);

	while(fscanf(finfile,"%[^\n]\n", linebuf) != EOF)
	{
		int Loc =0;
		char label[2]="?";
		int term;
		double tw;
		double max=0;

		//skip the leading blanks
		while(linebuf[Loc] == ' ' && linebuf[Loc] != '\0') Loc++;
		if(train){
			// Read out the class label clabel;
			sscanf(linebuf+Loc, "%s", &label);
			//skip the scanned class label part
			while(linebuf[Loc] != ' ' && linebuf[Loc] != '\0') Loc++;
			//skip the interval blanks
			while(linebuf[Loc] == ' ' && linebuf[Loc] != '\0') Loc++;
		}

		fprintf(foutfile, "{");
		// Parse each part;
		while(sscanf(linebuf+Loc, "%d:%lf", &term, &tw) != EOF)
		{
			//fprintf(foutfile, "%d %1.6f, ", term-1, tw);
			fprintf(foutfile, "%d %1.6f, ", term, tw);

			//skip the scanned part
			while(linebuf[Loc] != ' ' && linebuf[Loc] != '\0') Loc++;

			//skip the leading blanks
			while(linebuf[Loc] == ' ' && linebuf[Loc] != '\0') Loc++;

		} // end sscanf()
		fprintf(foutfile, "%d %s}\n", fea_no, label);

		memset(&linebuf, ' ', 509600);

	} // end fscanf(ftrainc)
	fclose(finfile);
	fclose(foutfile);

}

int main()
{
	printf("Start....\n");
	// Initiate common parameters;
	//input and output directoryies
	//char dirinput[] = "E:\\Experiment\\Reuters\\Formatting\\Data\\Input\\";
	char dirinput[] = "./";
	//char dirweka[] = "E:\\Experiment\\Reuters\\Formatting\\Data\\Weka\\";
	std::cout<<"Enter number of features"<<std::endl;
	unsigned int fea_no=0;
	std::cin>>fea_no;

	int i, j;
	read(fea_no,true);
	read(fea_no,false);
	printf("\n");

	printf("\n");


	printf("Done.\n");	
	return 0;

}
