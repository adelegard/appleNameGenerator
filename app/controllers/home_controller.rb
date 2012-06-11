%w(rubygems wordnik).each {|lib| require lib}
require "randexp"
#require "logger"

class HomeController < ApplicationController

  caches_page :index
  def index
  end

  def name
  	full_name()
  	render :partial => "home/name"
  end

  def full_name
    @endsWithS = false
    @name = "Ummmm"
    begin
      @name = ResponseWord.get_name()
      if @name[-1, 1] == "S"
        @endsWithS = true
        @name = @name.chomp("S")
      end
    rescue
    end
  end

end
