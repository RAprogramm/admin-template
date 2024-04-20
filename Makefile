build:
	docker-compose -f docker-compose.bd.yml up -d
	docker-compose build
	docker-compose -f docker-compose.bd.yml down

start:
	docker-compose up -d

stop:
	docker-compose down

test_prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
