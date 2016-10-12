//#include <bits/stdc++.h>
//#include <bits/stdc++.h>
#include <iostream>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>
#include <algorithm>
#include <cmath>
#include <vector>
#include <queue>
#include <stack>
#include <set>
#include <map>
#include <fstream>
using namespace std;

vector<int> name;
vector<int> predicted;

int main() {
    ios_base::sync_with_stdio(0);

    ifstream listTest ("/Users/kunn/Desktop/assg2_folder/5Newsgroups/output/list_test.txt");
    ifstream prediction ("weka_prediction.txt");

    int a;
    while (listTest >> a) {
        name.push_back(a);
    }

    string s;
    while (getline(prediction, s)) {
        predicted.push_back(s[30]-'0');
    }

    cout << name.size() << endl;
    cout << predicted.size() << endl;

    ofstream output ("prediction58.txt");
    for (int i = 0; i < name.size(); i++) {
        output << name[i] << ":" << predicted[i] << endl;
    }
    output.close();
    return 0;
}