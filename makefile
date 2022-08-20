build:
	git config credential.helper store
	git pull
	docker-compose build
	docker-compose up -d --remove-orphans
	docker-compose logs -f --tail=100 