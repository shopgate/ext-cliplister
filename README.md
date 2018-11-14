# Shopgate Connect - Cliplister Extension

[![GitHub license](http://dmlc.github.io/img/apache2.svg)](LICENSE)
[![Build Status](https://travis-ci.org/shopgate/ext-cliplister.svg?branch=master)](https://travis-ci.org/shopgate/ext-cliplister)
[![Coverage Status](https://coveralls.io/repos/github/shopgate/ext-cliplister/badge.svg?branch=master)](https://coveralls.io/github/shopgate/ext-cliplister?branch=master)

[Cliplister](https://cliplister.com) implementation for [Shopgate Connect](https://developer.shopgate.com) platform.

## Installation
### Domains
In order to make this extension work correctly the cliplister account must whitelist following domains:
- connect.shopgate.com
- sandbox.cdn.connect.shopgate.com

### Configuration

Set the following values in your Shopgate Connect Admin:
* `customerNumber` - (number) Cliplister customer number (required)
* `assetType` - (text) Video search key: (EAN or PRODUCT_NUMBER) (optional, defaults to EAN)

#### Example

```json
{
    "customerNumber": 12345,
    "assetType": "PRODUCT_NUMBER"
}
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) file for more information.

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) file for more information.

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native
apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

## License

This extension is available under the Apache License, Version 2.0.

See the [LICENSE](./LICENSE) file for more information.
