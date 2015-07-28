# WalmartChallenge
#How to run
After pulling the repository, you have to run the following:

npm install
node bin/www

The first one installs the modules necessary by checking package.json.
Some packages come with a default Express app. I didn't have time to weed them out.
The second one runs the server.

You can make a GET request as the following:

GET host/search/keyword

Known issues:
- Some requests return 403. I think the reason is the rate limit. I tried to handle this by timeout but it didn't help.
So, sometimes it might return an empty array since the keyword you are searching does not exist in any successful request.
- Since I couldn't figure out during the challenge how to pass around with callbacks, I chose to use a global variable.
This might give some weird results.
- Status codes in unsucessful cases are not handled.
