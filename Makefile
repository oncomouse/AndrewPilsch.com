PY=python
PANDOC=pandoc

BASEDIR=$(PWD)
INPUTDIR=$(BASEDIR)/source/cv
OUTPUTDIR=$(BASEDIR)
STYLEDIR=$(BASEDIR)/lib/pandoc-templates

help:
	@echo ' 																	  '
	@echo 'Makefile for the Markdown CV                                       '
	@echo '                                                                       '
	@echo 'Usage:                                                                 '
	@echo '   make html                        (re)generate the web site          '
	@echo '   make pdf                         generate a PDF file  			  '
	@echo '   make docx	                       generate a Docx file 			  '
	@echo '   make tex	                       generate a Docx file 			  '
	@echo '                                                                       '
	@echo 'Set the DEBUG variable to 1 to enable debugging, e.g. make DEBUG=1 html'
	@echo ' 																	  '
	@echo 'pandoc test.md -o test.pdf --bibliography=test_ref.bib --csl=plos.csl  '
	@echo ' 																	  '
	@echo 'get templates from: https://github.com/jgm/pandoc-templates			  '

pdf:
	pandoc -s \
	"$(INPUTDIR)"/*.md \
	-o "$(OUTPUTDIR)/cv.pdf" \
	-f markdown+pipe_tables \
	--template="$(STYLEDIR)/cv-template.tex" \
	--latex-engine=xelatex

tex:
	pandoc -s \
	"$(INPUTDIR)"/*.md \
	-o "$(OUTPUTDIR)/cv.tex" \
	-f markdown+pipe_tables \
	--template="$(STYLEDIR)/cv-template.tex" \
	--latex-engine=xelatex

docx:
	pandoc "$(INPUTDIR)"/*.md \
	-o "$(OUTPUTDIR)/cv.docx" \
	-f markdown+pipe_tables \

html:
	pandoc "$(INPUTDIR)"/*.md \
	-f markdown+pipe_tables \
	-o "$(OUTPUTDIR)/cv.html"

.PHONY: help pdf docx html tex
