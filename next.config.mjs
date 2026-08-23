/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /boolean_wasm_bg|draco_wasm_wrapper|draco_decoder/
      })
    );
    return config;
  },
};
export default nextConfig;
