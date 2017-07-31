require 'net/http'
require 'uri'

class Api::PagesController < ApplicationController

  def create
    page_content = Net::HTTP.get(URI.parse(params[:url]))
    document = Nokogiri::HTML(page_content)

    @tags = Hash.new { |h, k| h[k] = [] }
    @elements = []

    document.traverse do |node|
      next unless node.is_a?(Nokogiri::XML::Element)
      next if node.element_children.length > 0
      @elements << [node.to_s.force_encoding("ISO-8859-1").encode("UTF-8"), node.name]
      @tags[node.name] << node.to_s.force_encoding("ISO-8859-1").encode("UTF-8")
    end

    render 'api/pages/show'
  end
end
