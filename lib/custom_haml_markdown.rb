module Haml::Filters
    remove_filter("Markdown")
    module Markdown
        include Base
        def render text
            md_options = {
                :fenced_code_blocks => true,
                :autolink => true, 
                :smartypants => true,
                :footnotes => true,
                :superscript => true,
                "entity_output" => :symbolic 
            }

            ::Tilt.prefer ::Tilt::KramdownTemplate
            template = ::Tilt['md'].new(md_options){ text }.render
            
            #Kramdown::Document.new(text, md_options).to_html
        end
    end
end
        