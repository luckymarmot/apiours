TEST = $(shell echo $$TEST)

NVM_DIR = $(shell echo $$NVM_DIR)

ifeq (${TEST},TRUE)
		SOURCE = .
else
		SOURCE = source
endif

build:
	${SOURCE} ${NVM_DIR}/nvm.sh && nvm use && NODE_ENV=production yarn run build

install:
	${SOURCE} ${NVM_DIR}/nvm.sh && nvm install
	${SOURCE} ${NVM_DIR}/nvm.sh && nvm use && yarn install

test:
	${SOURCE} ${NVM_DIR}/nvm.sh && nvm use && yarn test

lint:
	${SOURCE} ${NVM_DIR}/nvm.sh && nvm use && ./node_modules/eslint/bin/eslint.js -c linting/dev.yaml src/

clean:
	rm -rf static

run:
	${SOURCE} ${NVM_DIR}/nvm.sh && nvm use && yarn start
