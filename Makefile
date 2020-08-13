build: lint vue-cli-build

vue-cli-build:
	@npm run build

lint:
	@npm run lint

server:
	@npm run serve

install-css:
	@vue add tailwind

.PHONY: build vue-cli-build lint server
