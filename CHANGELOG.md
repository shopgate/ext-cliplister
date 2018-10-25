# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Changed
- Updated readme with domain whitelisting information
## [1.0.1] - 2018-10-02
### Fixed
- On iOS there is a workaround executed that makes the <video> element always being rendered on top of the Cliplister container. It's needed since Cliplister doesn't render its own controls on iOS, but the container which usually contains them is rendered on top of the <video> element which makes the natives controls not reachable for user. It happens however only starting from second render of the page containing Cliplister video.
- Periodical exceptions thrown by Cliplister library (JSON parsing issue) caused by obsolete `slot` property passed to the `Cliplister.Viewer`.
### Removed
- Removed `slot` extension config and it's implementation. Change is backwards compatible. This property was obsolete and causing troubles on live. Currently is ignored if set by extension config.

## [1.0.0] - 2018-09-28
### Added
- First, simple implementation that shows the video player before the product description.


[Unreleased]: https://github.com/shopgate/ext-cliplister/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/shopgate/ext-cliplister/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/shopgate/ext-cliplister/compare/v0.0.1...v1.0.0
