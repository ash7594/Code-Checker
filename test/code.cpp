#include<bits/stdc++.h>
using namespace std;

bool comp(const long long &a, const long long &b) {
	return a>b;
}

int main() {
	long long t,t1;
	cin>>t;
	t1 = 1;
	while(t--) {
		long long p,n;
		cin>>p;
		vector<long long> pval(p);
		//copy_n(istream_iterator<long long>(cin), p, back_inserter(pval));
		for (long long i=0;i<p;i++) {
			cin>>pval[i];
		}
		
		cin>>n;
		vector<long long > x(n);

		map<string, vector<long long> > mapper;
		map<string, vector<long long> >::iterator iter;
		string name;
		for (long long i=0;i<n;i++) {
			cin>>x[i];
			for (long long j=0;j<p;j++) {
				cin>>name;
				iter = mapper.find(name);
				if (iter == mapper.end()) {
					vector<long long> temp;
					temp.push_back(x[i]*pval[j]);
					mapper.insert(make_pair(name, temp));
				} else {
					(iter->second).push_back(x[i]*pval[j]);
				}
			}
		}
		long long m;
		cin>>m;

//		for (iter = mapper.begin();iter!=mapper.end();iter++) {
//			cout<<iter->first<<endl;
//			copy((iter->second).begin(),(iter->second).end(),ostream_iterator<long long>(cout, " "));
//			cout<<endl;
//		}

		map<long long, vector<string> > hash;
		
		map<long long, vector<string> >::reverse_iterator it;
		map<long long, vector<string> >::iterator pit;

		for (iter=mapper.begin();iter!=mapper.end();iter++) {
			sort((iter->second).begin(), (iter->second).end(), comp);
			long long sum = 0;
			for(long long i=0;i<m && i<(iter->second).size();i++) {
				sum += (iter->second)[i];
			}
			pit = hash.find(sum);
			if (pit == hash.end()) {
				vector<string> s;
				s.push_back(iter->first);
				hash.insert(make_pair(sum, s));
			} else {
				(pit->second).push_back(iter->first);
			}
		}

		printf("Case #%lld:\n",t1);
		long long pos = 1;
		for (it = hash.rbegin(); it!=hash.rend();it++) {
			sort((it->second).begin(), (it->second).end());
			for (long long i=0,pos2=pos;i<(it->second).size();i++) {
				cout<<pos2<<": "<<(it->second)[i]<<endl;
				pos++;
			}
		}
		t1++;
	}
}

