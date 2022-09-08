Pod::Spec.new do |s|
  s.name         = "RNInstnt"
  s.version      = "1.0.0"
  s.summary      = "Instnt React Native SDK"
  s.description  = "Instnt React Native SDK"
  s.homepage     = "https://www.instnt.org/"
  s.license = { :type => "MIT", :file => "LICENSE" }
  s.author = { "Instnt, Inc" => "support@instnt.com" }
  s.source       = { :git => "https://github.com/instnt-inc/instnt-react-native-sdk", :tag => "main" }
  s.platform     = :ios, "13.0"

  s.source_files  = "ios/**/*.{h,m,mm,swift}"
#   s.requires_arc = true

  s.dependency "React-Core"
  s.dependency "FingerprintPro", '~> 2.1.1'
end
