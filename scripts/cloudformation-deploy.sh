#!/bin/bash

aws cloudformation deploy --template-file ../template.yaml --stack-name todo-api-stack

exit 0
