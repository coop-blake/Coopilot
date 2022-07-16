FROM node

WORKDIR /balek
COPY ./ /balek


RUN apt-get update
RUN apt-get install -y default-jre

#Next two lines for windows docker hosts, otherwise not needed
RUN apt-get install -y dos2unix
RUN find /balek -type f -print0 | xargs -0 -n 1 -P 4 dos2unix


WORKDIR /balek/builds/standalone/buildScripts/UNFIPricer/

RUN npm install

# Run loadServer.js when the container launches
CMD ["npm", "run", "build"]

