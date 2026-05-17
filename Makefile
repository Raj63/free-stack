install:
	npm install

run:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

clean:
	rm -rf .next node_modules

reinstall:
	rm -rf node_modules package-lock.json
	npm install