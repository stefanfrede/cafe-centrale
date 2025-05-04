default:
  just --list

_bake args:
	COMPOSE_BAKE=true docker compose {{args}}

_compose args:
	docker compose {{args}}

_remove_container:
	docker rm doty

_remove_image:
	docker rmi -f doty/eleventy

[group('docker')]
build: (_bake "run --rm node npm run build")

[group('docker')]
restart: stop start

[group('docker')]
start: (_compose "up -d")

[group('docker')]
stop: (_compose "down")

[group('debugging: docker')]
log: (_compose "logs")

[group('debugging: docker')]
watch: (_compose "logs -f")

[group('maintenance: docker')]
purge: stop _remove_image

[group('maintenance: node')]
update: (_bake "run --rm node npm update")
