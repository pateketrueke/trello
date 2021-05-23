dev:
	@npm run dev & npm run watch & npm run mailor

clean:
	@rm -rf build/*
	@rm -f cache.json
