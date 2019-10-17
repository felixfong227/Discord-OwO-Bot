up:
	docker-compose up

up-silent:
	docker-compose up -d
	
down:
	docker-compose down
	
log:
	docker-compose logs -f

log-once:
	docker-compose logs