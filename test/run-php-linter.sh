#!/usr/bin/env bash
set -euo pipefail


# Run PHP -l on everything to ensure there's no syntax
# errors.
for i in `git ls-files |egrep '.class.inc$|.php$'`
do
  php -l $i >/dev/null || exit $?;
done

vendor/bin/phpcs --standard=test/StrictTypesCS.xml --extensions=php,inc "${strict_libraries[@]/#/php/libraries/}" || exit $?;

# Run PHPCS on src/ directory using a different ruleset conforming to PSR2.
vendor/bin/phpcs --standard=test/SrcCS.xml --extensions=php/php src/ || exit $?;

vendor/bin/phpmd php/,modules/,src/ text 'test/LorisPHPMD.xml' || exit $?;

# Run PHPStan on php/ and modules/
vendor/bin/phpstan analyse \
    --level max \
    -c ./test/phpstan-loris.neon \
    --error-format table \
    php/ \
    modules/ \
    || exit $?
