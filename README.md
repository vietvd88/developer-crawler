In this project, we use chentsulin's electron template to build structure.  
For more details, please check his repository: 
-   https://github.com/chentsulin/electron-react-boilerplate

***How to run.***  
1. install node  
    brew install node  
2. install dependency packages  
    -   goto project directory and run command  
    -   npm install  
3. start selenium server  
    -   open new terminal tab, goto project directory and run command  
    -   ./node_modules/.bin/chromedriver --url-base=wd/hub --port=9515  
4. start node server  
    -   open new terminal tab, goto project directory and run command  
    -   npm run hot-server  
5. start application  
    -   open new terminal tab, goto project directory and run command  
    -   npm run start-hot  

***How to use.***
1. Crawl developer list  
This is home page.
![Home page](https://raw.githubusercontent.com/vietvd88/developer-crawler/master/app/screenshots/home-screen.png)  

-   Input a root url into the textbox next to "start crawling" 
    (ex: http://git-awards.com/users?utf8=%E2%9C%93&type=country&language=php&country=Vietnam)  
-   Select wright page type for the url (ex: github)   
-   Click on "Start Crawling" button

===> Ressult:
-   A web browser window openned 
-   A list of developer url is inserted into developer_url_queue table  
    To see results in database, please install sqlite browser and select db file : **app/db/app.db**
![developer-list-crawler-screen](https://raw.githubusercontent.com/vietvd88/developer-crawler/master/app/screenshots/developer-list-crawler-screen.png)  
![url-queu-screen](https://raw.githubusercontent.com/vietvd88/developer-crawler/master/app/screenshots/url-queu-screen.png)  
2. Crawl developer detail
-   When application starts, a hidden process will run each 30 seconds.
-   Each process will open a web browser window 