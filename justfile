default:
  just --list

compose args:
	docker compose {{args}}

start: (compose "up -d")

stop: (compose "down")

restart: stop start

build: (compose "run --rm node npm run build")

purge: stop rmi

rmc:
	docker rm doty

rmi:
	docker rmi -f doty/eleventy
