# Overview

The objective of this project is to create a data file revealing how Australia's political parties voted on issues in federal parliament.

This is a sub-project by the developers of [How 2 Vote](https://how2vote.com.au/).

Data for this project is taken from the [They Vote For You](https://theyvoteforyou.org.au/) API, in accordance with their share-alike license. This project is licensed under the Open Data Commons Open Database License (see the [LICENSE.md](LICENSE.md) for details).

# Installation

## Prerequisites

You must have [Node](https://nodejs.org/en/download/) and [NPM](https://www.npmjs.com/get-npm) installed.

## Install packages

Once the prerequisites are installed, clone the repository to your local machine, and then run:

```
npm install
```

This will install all of the Node dependencies.

## Add your API key

To get your free API key, just [create an account](https://theyvoteforyou.org.au/users/sign_up) at *They Vote For You*.

Add your API key to the ``apikey.conf`` file.

# Usage

## Fetch the latest data

To generate new data files from the API simply run:

```
npm run fetch
```

## Process the data

To compile the data file, run:

```
npm run process
```

# Feedback

Feel free to contact us directly via our contact page on [How 2 Vote](https://how2vote.com.au/contact/), or if your feedback relates to a bug or suggestion for this project, feel free to raise a [New Issue](https://github.com/National-Digital/theyvoteforyou.how2vote.com.au/issues) in this repository.