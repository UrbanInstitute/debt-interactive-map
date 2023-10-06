.PHONY: clean default

default: data/us-5m-2020-shapes.json

clean: 
	rm -rf data/output-shapes
	
	

#download original zip files
data/output-shapes/cb_2020_us_county_5m.zip:
	mkdir -p $(dir $@)
	curl -o $@ -L https://www2.census.gov/geo/tiger/GENZ2020/shp/cb_2020_us_county_5m.zip
	touch $@
	  
data/output-shapes/cb_2020_us_state_5m.zip:
	mkdir -p $(dir $@)
	curl -o $@ -L https://www2.census.gov/geo/tiger/GENZ2020/shp/cb_2020_us_state_5m.zip
	touch $@
	  
data/output-shapes/cb_2020_us_nation_5m.zip:
	mkdir -p $(dir $@)
	curl -o $@ -L https://www2.census.gov/geo/tiger/GENZ2020/shp/cb_2020_us_nation_5m.zip
	touch $@

	
	
#unzip those zipfiles
data/output-shapes/cb_2020_us_county_5m/cb_2020_us_county_5m.shp: data/output-shapes/cb_2020_us_county_5m.zip
	mkdir -p $(dir $@)
	unzip -o $^ -d $(dir $@)
	touch $@
	
data/output-shapes/cb_2020_us_state_5m/cb_2020_us_state_5m.shp: data/output-shapes/cb_2020_us_state_5m.zip
	mkdir -p $(dir $@)
	unzip -o $^ -d $(dir $@)
	touch $@
	
data/output-shapes/cb_2020_us_nation_5m/cb_2020_us_nation_5m.shp: data/output-shapes/cb_2020_us_nation_5m.zip
	mkdir -p $(dir $@)
	unzip -o $^ -d $(dir $@)
	touch $@

	
	
#plug unzipped shapefiles into mapshaper
data/us-5m-2020-shapes.json: \
  data/output-shapes/cb_2020_us_county_5m/cb_2020_us_county_5m.shp \
  data/output-shapes/cb_2020_us_state_5m/cb_2020_us_state_5m.shp \
  data/output-shapes/cb_2020_us_nation_5m/cb_2020_us_nation_5m.shp
	mkdir -p $(dir $@)
	npx mapshaper $^ combine-files\
		-filter "parseInt(STATEFP) < 60" target=cb_2020_us_county_5m name=counties \
		-filter "parseInt(STATEFP) < 60" target=cb_2020_us_state_5m name=states \
		-filter-fields GEOID target=* \
		-rename-fields id=GEOID target=* \
		-rename-layers target=cb_2020_us_nation_5m names=nation \
		-o format=topojson id-field=id drop-table bbox target=* $@
	touch $@

