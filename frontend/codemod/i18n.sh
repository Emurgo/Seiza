#!/bin/bash

die() { echo "$*" 1>&2 ; exit 1; }

JSCS=jscodeshift
command -v $JSCS || die "You need $JSCS. Install by npm -g install $JSCS"
jscodeshift -t codemod/i18n.js src/ --parser=flow && yarn prettier
