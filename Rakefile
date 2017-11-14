task :build do
  system "bundle exec middleman build"
end

task :serve do
  system "bundle exec middleman"
end

task :deploy do
  system "bundle exec middleman deploy"
end

task :cv do
  system "cat source/cv/_src.md | ruby -e 'puts STDIN.read.gsub(/-\\|\\n\\| /,\"-|\\n| X\")' | pandoc -o cv.pdf -f markdown+pipe_tables --template=lib/pandoc-templates/cv-template.tex --latex-engine=xelatex"
end
