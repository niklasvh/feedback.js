#
# simple makefile to help on feedback.js packaging and deployment
#

# define package name
NAME=feedback.js

# define package name minify
NAME_MIN=feedback.min.js

# define source dir
SRC_DIR=src

help:
	@printf "\n This is a simple helper for packaging and distribution issues.\n"
	@printf "\n Available options:\n\n"
	@printf "\t * help	- show this message\n" 
	@printf "\t   compile	- build source\n" 
	@printf "\t   tests	- TODO :: run jshint e qunit tests\n" 
	@printf "\t   clean	- remove interface tarball\n" 
	@printf "\n"
	@printf "\t * default target\n\n"
compile:

	@printf "  * Building Feedback.js ... \n"
	@printf "  * Running JSHint ... "
	@jshint src/*.js src/pages/*.js src/send/*.js
	@printf "  done \n"

	@printf "  * Compiling ... "
	@cat $(SRC_DIR)/license.txt \
	    $(SRC_DIR)/pre.txt \
	    $(SRC_DIR)/Core.js \
	    $(SRC_DIR)/Page.js \
	    $(SRC_DIR)/Send.js \
	    $(SRC_DIR)/pages/Form.js \
	    $(SRC_DIR)/pages/Review.js \
	    $(SRC_DIR)/pages/Screenshot.js \
	    $(SRC_DIR)/send/xhr.js \
	    $(SRC_DIR)/post.txt > $(NAME)
	@printf "  done \n"

	@printf "  * Minifying ... "
	@uglifyjs $(NAME) > $(NAME_MIN)
	@printf "  done, thanks \n"

# TODO
clean:

# TODO
tests:

# EOF