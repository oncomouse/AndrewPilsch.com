module Haml::Filters
    module Markdown
        include Base
        def render text
            md_options = {
                :fenced_code_blocks => true,
                :autolink => true, 
                :smartypants => true,
                :footnotes => true,
                :superscript => true
            }
            ::Tilt.prefer ::Tilt::RedcarpetTemplate
            template = ::Tilt['md'].new(md_options){ text }.render
        end
    end
end
        