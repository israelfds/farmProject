#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }

  readonly hook_name="$(basename -- "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  readonly husky_root="$(dirname -- "$0")/../.."
  readonly hook_dir="$husky_root/.husky"

  export readonly husky_git_params="$*"
  export readonly husky_hook_name="$hook_name"

  # Source user defined hook
  if [ -f "$hook_dir/$hook_name" ]; then
    debug "running $hook_dir/$hook_name"
    . "$hook_dir/$hook_name"
  else
    debug "can't find hook in $hook_dir/$hook_name"
  fi
fi 