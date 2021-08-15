#!/bin/bash
ROOT_DIR_NAME=$(cd `dirname $0`; pwd)
cd ${ROOT_DIR_NAME}/client && npm run build