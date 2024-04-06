#!/bin/bash

osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/admin && npm run dev"'
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/client && npm run start"'
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/server && npm run start"'
