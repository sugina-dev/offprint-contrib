#!/bin/bash

buildf()
{
  name=$1
  extraArgs=$2

  src=".$name.md"
  dst="$name.html"
  title="`grep -Po -m 1 '(?<=title: ).+' $src | sed -e 's/_\([^_]*\)_/<em>\1<\/em>/'`"

  if [ "$src" -nt "$dst" -o "$0" -nt "$dst" ]; then
    echo "Build target $title"
    pandoc --verbose --fail-if-warnings --toc -c ../pandoc.css $extraArgs -s "$src" -o "$dst" -Mtitle="$title"
  fi
}

buildf index
