dev: deps
	@npm run dev & npm run watch & npm run mailor

deps:
	@(((ls node_modules | grep .) > /dev/null 2>&1) || npm i) || true

clean:
	@rm -rf build/*
	@rm -f cache.json
