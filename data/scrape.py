# -*- coding: utf-8 -*-
import time
import urllib2
import numpy as np
import pandas as pd
from bs4 import BeautifulSoup

data = []

states = [i.strip().split(',') for i in open('states.csv', 'rb').read().split('\n')][:-1]
for s in states:
    print 'Processing: ' + s[1]
    try:
        soup = BeautifulSoup(urllib2.urlopen(s[1]), 'lxml')
        city_list = soup.findAll('ul')[9].findAll('li')

        for c in city_list:
            crime_url = 'http://www.city-data.com/crime/' + c.find('a').get('href')
            try:
                page = urllib2.urlopen(crime_url)
                soup = BeautifulSoup(page, 'lxml')
                table = soup.find('table', {'class': 'table tabBlue tblsort tblsticky sortable'})
                crime_index_row = table.findAll('tr')[9]
                crime_index_values = [float(i.text) for i in crime_index_row.findAll('td')[1:]]
                crime_index_mean =  np.mean(crime_index_values)

                print [s[0], c.text.strip().replace('Crime', ''), crime_index_mean]
                data.append([s[0], c.text.strip().replace('Crime', ''), crime_index_mean])
                time.sleep(3)
            except:
                print 'cannot open: ', crime_url
    except:
        print 'cannot open: ', s[1]

print '\nGenerating Output Data'

output = open('crime_data.csv', 'wb')
for d in data:
    output.write(d[0]+','+d[1]+','+d[2]+'\n')
output.close()
