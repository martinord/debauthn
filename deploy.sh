#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
DGRAY='\033[1;30m'
NC='\033[0m' # No Color

install(){
    echo -e "\n${GREEN}## Intalling the backend dependencies and applying patches ...${DGRAY}"
    npm install && npm run postinstall
    echo -e "\n${YELLOW} ## Done!"
}

server(){
    echo -e "\n${GREEN}## Starting Debauthn server ..."
    echo -e "\n${YELLOW}!!Warning: check all configuration at /src/config${DGRAY}"
    npm run start
}

build_front(){
    echo -e "\n${RED}#1 ${GREEN}Cloning the front code ...${DGRAY}"mo   
    git submodule update --init --recursive || { echo -e "${RED}Error when cloning the code" && exit; }
    cd debauthn-frontend

    echo -e "\n${RED}#2 ${GREEN}Installing npm dependencies ...${DGRAY}"
    npm install || { echo -e "${RED}Error when installing dependencies" && exit; }

    echo -e "\n${RED}#3 ${GREEN}Building the static files ...${DGRAY}"
    npm run build || { echo -e "${RED}Error when building the frontend" && exit; }
    
    echo -e "\n${RED}#4 ${GREEN}Removing public folder at the backend public folder ...${DGRAY}"
    rm -rf ../src/public/*
    
    echo -e "\n${RED}#5 ${GREEN}Copying files ...${DGRAY}"
    cp -r dist/* ../src/public/

    echo -e "\n${YELLOW}## Done! Now you have successfully built and you are ready to go!"
    cd ..
}

docker(){
    echo "Docker not yet implemented"
}

all(){
    echo -e "\n${GREEN}## Running quick start ...${DGRAY}"
    install
    build_front
    server

}

usage(){
    echo "Usage: ./deploy"
    echo "   -a|--all     : Installs and deploys the project"
    echo "   -i|--install : Installs backend dependencies"
    echo "   -s|--server  : Runs the backend server"
    echo "   -f|--front   : Builds the front and installs it"
    echo "   -d|--docker  : Creates a docker image"
    echo "   -h|--help    : Displays this help"
    echo -e "${YELLOW} \n Check the server configuration at /src/config"    
}


echo -e "${DGRAY}\n#########################################"
echo -e "##              DEBAUTHN                #"
echo -e "#########################################"
echo -e "#A WebAuthn Authenticator Debugging Tool#\n${NC}"

case $1 in
    -a|--all)
        all
        ;;
    -i|--install)
        install
        ;;
    -s|--server)
        server
        ;;
    -f|--front)
        build_front
        ;;
    -d|--docker)
        build_front
        docker
        ;;
    -h|--help)
        usage
        ;;
    *)
        usage
esac
