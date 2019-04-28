#!/bin/bash

buildf()
{
  name=$1
  extraArgs=$2

  src=".$name.md"
  dst="$name.html"
  title="`grep -Po -m 1 '(?<=# ).+' $src`"

  if [ "$src" -nt "$dst" -o "$0" -nt "$dst" ]; then
    echo "Build target $src"
    pandoc --toc -c ../pandoc.css $extraArgs -s "$src" -o "$dst" -Mtitle="$title"
  fi
}

buildf index
