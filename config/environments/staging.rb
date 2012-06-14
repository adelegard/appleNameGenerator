MyApp::Application.configure do
  config.middleware.insert_after(::Rack::Lock, "::Rack::Auth::Basic", "Staging") do |u, p|
    [u, p] == ['username', 'password']
  end

  #... other config
end
