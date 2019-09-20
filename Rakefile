# frozen_string_literal: true

task :serve do
  system 'bundle exec jekyll serve'
end

task :deploy do
  system "rsync -avz '-e ssh -p 22' _site/ eschaton@birkenfeld.dreamhost.com:~/www/andrew.pilsch.com/"
  # system "scp -r _site/* eschaton@birkenfeld.dreamhost.com:~/www/andrew.pilsch.com/"
end

namespace :build do
  task :jekyll do
    system 'env JEKYLL_ENV=production bundle exec jekyll build'
  end

  task :cv do
    $stdout.print "\nBuilding cv.pdf..."; $stdout.flush
    preamble = IO.read('_data/cv.yml')
    content = IO.read('_includes/cv.md')
    File.open('tmp.md', 'w') do |fp|
      fp.write "---\n"
      fp.write preamble
      fp.write "---\n"
      fp.write content
    end
    system 'pandoc -s -o _site/cv/cv.pdf -f markdown+pipe_tables+smart --template=_plugins/pandoc-templates/cv-template.tex --pdf-engine=xelatex tmp.md'
    system 'rm tmp.md'
    puts 'done'
  end

  task :compress do
    $stdout.print 'Compressing site.js...'; $stdout.flush
    system './node_modules/.bin/uglifyjs -o _site/js/site.js _site/js/site.js'
    $stdout.puts 'done'
    $stdout.print 'Compressing *.html...'; $stdout.flush
    system './node_modules/.bin/html-minifier --input-dir _site --output-dir _site --file-ext html --collapse-whitespace --remove-comments --remove-attribute-quotes --remove-empty-attributes --use-short-doctype --minify-js --minify-css'
    $stdout.puts 'done'
    $stdout.print 'Building Custom Tachyons.css...'; $stdout.flush
    system './node_modules/.bin/extract-tachyons `find _site -name "*.html"` --compress --output _site/css/tachyons-custom.min.css'
    $stdout.puts 'done'
    $stdout.print 'Embedding Assets...'; $stdout.flush
    system 'node _scripts/embed-js.js `find _site -name "*.html"`'
    $stdout.puts 'done'
  end
  task all: %i[jekyll cv compress]
end

task build: ['build:all']
