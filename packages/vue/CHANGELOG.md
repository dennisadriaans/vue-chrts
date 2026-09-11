# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## Unreleased

## [2.2.3](https://github.com/dennisadriaans/vue-chrts/compare/vue-chrts@2.2.2...vue-chrts@2.2.3) (2026-09-11)

### Dependencies

* bump `@unovis/ts` and `@unovis/vue` to ^1.7.0

## [2.2.2](https://github.com/dennisadriaans/vue-chrts/compare/v2.2.1...vue-chrts@2.2.2) (2026-09-11)

### Bug Fixes

* **vue:** return live slot element from DonutChart tooltip trigger ([#130](https://github.com/dennisadriaans/vue-chrts/issues/130)) ([#153](https://github.com/dennisadriaans/vue-chrts/issues/153)) ([5002b3c](https://github.com/dennisadriaans/vue-chrts/commit/5002b3c0fe3cfde6c0837b9f9cad77a6794e853e))
* **vue:** return live slot element from BarChart tooltip trigger ([#145](https://github.com/dennisadriaans/vue-chrts/issues/145)) ([#150](https://github.com/dennisadriaans/vue-chrts/issues/150)) ([5a30541](https://github.com/dennisadriaans/vue-chrts/commit/5a3054149cbef63e63804c2a82af98a0fe19cd57))
* **vue:** unwrap StackedBar datum for BarChart tooltip ([#147](https://github.com/dennisadriaans/vue-chrts/issues/147)) ([#151](https://github.com/dennisadriaans/vue-chrts/issues/151)) ([ca64894](https://github.com/dennisadriaans/vue-chrts/commit/ca64894140c034d726980c54661a873ea5079dca))
* **vue:** default tooltip placement to Position.Auto ([#149](https://github.com/dennisadriaans/vue-chrts/issues/149)) ([#152](https://github.com/dennisadriaans/vue-chrts/issues/152)) ([64da723](https://github.com/dennisadriaans/vue-chrts/commit/64da723155ca5d762deabc1235782c9303965e0a))
* **vue:** make BarChart value labels reactive to data/yAxis/orientation changes ([#141](https://github.com/dennisadriaans/vue-chrts/issues/141)) ([b4cf145](https://github.com/dennisadriaans/vue-chrts/commit/b4cf14534c84c165071487db312a0d60c9f71410))
* clean up old files and prepare release script ([9dfac7d](https://github.com/dennisadriaans/vue-chrts/commit/9dfac7d2e0c31fa30a89f0f4a7fa28265252b9f0))
* make DonutChart prop `type` reactive after mount ([#144](https://github.com/dennisadriaans/vue-chrts/issues/144)) ([b87bc80](https://github.com/dennisadriaans/vue-chrts/commit/b87bc80c4a976cb1ca051fcf2206128495d6b1f5))

## [2.2.1](https://github.com/dennisadriaans/vue-chrts/compare/vue-chrts-v2.2.1-beta.0...vue-chrts-v2.2.1) (2026-07-23)

## [2.2.1-beta.0](https://github.com/dennisadriaans/vue-chrts/compare/vue-chrts-v2.2.0-test.0...vue-chrts-v2.2.1-beta.0) (2026-07-23)


### Bug Fixes

* merge ([879b390](https://github.com/dennisadriaans/vue-chrts/commit/879b3905cd4c70bbc64912baeb4bbfd8efdbbd07))
* remove vue-charts from transpile ([#136](https://github.com/dennisadriaans/vue-chrts/issues/136)) ([474d534](https://github.com/dennisadriaans/vue-chrts/commit/474d534cf713ab0738a05d3fe4cf282e10a9c608))
* **TopoJSONMap:** emit mouseenter/mouseleave ([#135](https://github.com/dennisadriaans/vue-chrts/issues/135)) ([5272de6](https://github.com/dennisadriaans/vue-chrts/commit/5272de64e50e416cb596f01daac08029bacbb51c))
* **TopoJSONMap:** guard optional categories in legend ([d7274f6](https://github.com/dennisadriaans/vue-chrts/commit/d7274f676f59fe5222e6091b2d9ba4823f278134))
* **vue:** guard flattenData against empty data in BarChart stackAndGrouped mode ([#140](https://github.com/dennisadriaans/vue-chrts/issues/140)) ([ba782a8](https://github.com/dennisadriaans/vue-chrts/commit/ba782a85eb248ab143718a242e62d992465041e4))
