const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { JSDOM } = require('jsdom');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';

const HTML_FILES = glob.sync('./src/*.html');
const pages = HTML_FILES.map((page) => {
    return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, page),
        filename: path.basename(page),
        chunks: [path.basename(page, '.html'), 'main'],
        minify: false
    });
});

const videoSourcePath = path.resolve(__dirname, './', 'src/assets/', 'video');
const videoDestPath = path.resolve(__dirname, './', 'dist/assets/', 'video');

const INCLUDE_PATTERN = /<include\s+src=["'](\.\/)?([^"']+)["'](?:\s+data-text='([^']+)')?\s*><\/include>/g;

function processNestedHtml(content, loaderContext, resourcePath = '') {
    let fileDir = resourcePath === '' ? path.dirname(loaderContext.resourcePath) : path.dirname(resourcePath);

    function replaceHtml(match, pathRule, src, dataText) {
        if (pathRule === './') {
            fileDir = loaderContext.context;
        }
        const filePath = path.resolve(fileDir, src);
        loaderContext.dependency(filePath);
        let html = fs.readFileSync(filePath, 'utf8');
        console.log('filePath: ', filePath, 'match: ', match);
        try {
            console.log('data: ', dataText);
            const data = dataText && JSON.parse(dataText);
            const dom = new JSDOM(html);
            const document = dom.window.document;
            if (data) {
                Object.keys(data).forEach((selector) => {
                    const elementData = data[selector];
                    const elements = document.querySelectorAll(selector);

                    if (elements.length > 0) {
                        elements.forEach((element) => {
                            if (elementData.text) {
                                element.textContent = elementData.text;
                            }
                            if (elementData.html) {
                                element.innerHTML = elementData.html;
                            }
                            if (elementData.class) {
                                element.classList.add(elementData.class);
                            }
                        });
                    } else {
                        console.error(`Elements with selector "${selector}" not found in ${src}`);
                    }
                });
            }

            html = document.body.innerHTML;
            html = processNestedHtml(html, loaderContext, filePath);
            console.log('html: ', html);
        } catch (error) {
            console.error(`Error parsing data-text attribute: ${error.message}`);
        }

        return html;
    }

    content = content.replace(INCLUDE_PATTERN, (match, pathRule, src, dataText) => {
        return replaceHtml(match, pathRule, src, dataText);
    });

    return content;
}

function processHtmlLoader(content, loaderContext) {
    let newContent = processNestedHtml(content, loaderContext);
    newContent = newContent.replace(/(src|data-src)="(.*?)\.(jpg|png)"/gi, (match, p1, p2, p3) => {
        return `${p1}="${p2}.webp"`;
    });
    return newContent;
}

module.exports = {
    mode,
    target,
    devtool: devMode ? 'inline-source-map' : false,
    devServer: {
        historyApiFallback: true,
        open: true,
        hot: true,
        port: 'auto',
        host: 'local-ip',
        static: path.resolve(__dirname, 'dist'),
        watchFiles: path.join(__dirname, 'src')
    },

    entry: {
        main: path.resolve(__dirname, 'src/js', 'app.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: '[name].[contenthash].js'
    },

    plugins: [
        new CleanWebpackPlugin(),
        ...pages,
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css'
        }),
        new ImageMinimizerPlugin({
            minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                    plugins: [
                        'imagemin-gifsicle',
                        'imagemin-mozjpeg',
                        'imagemin-pngquant',
                        'imagemin-svgo'
                    ]
                }
            }
        }),
        fs.existsSync(videoSourcePath)
            ? new CopyPlugin({
                  patterns: [
                      {
                          from: path.resolve(__dirname, './', 'src/assets/', 'images'),
                          to: path.resolve(__dirname, './', 'dist/assets/', 'images'),
                          noErrorOnMissing: true
                      },
                      {
                          from: path.resolve(__dirname, './', 'src/assets/', 'fonts'),
                          to: path.resolve(__dirname, './', 'dist/assets/', 'fonts'),
                          noErrorOnMissing: true
                      },
                      {
                          from: videoSourcePath,
                          to: videoDestPath,
                          noErrorOnMissing: true
                      }
                  ]
              })
            : new CopyPlugin({
                  patterns: [
                      {
                          from: path.resolve(__dirname, './', 'src/assets/', 'images'),
                          to: path.resolve(__dirname, './', 'dist/assets/', 'images'),
                          noErrorOnMissing: true
                      },
                      {
                          from: path.resolve(__dirname, './', 'src/assets/', 'fonts'),
                          to: path.resolve(__dirname, './', 'dist/assets/', 'fonts'),
                          noErrorOnMissing: true
                      }
                  ]
              }),
        ...(devMode ? [new webpack.HotModuleReplacementPlugin()] : [])
    ],

    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        minimize: !devMode,
        minimizer: [
            new TerserPlugin({
                parallel: true,
            }),
            new CssMinimizerPlugin(),
        ],
    },

    module: {
        rules: [
            {
                test: /\.html$/i,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            sources: false,
                            minimize: false,
                            esModule: false,
                            preprocessor: processHtmlLoader
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|webp|gif|svg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false,
                            modules: {
                                auto: true,
                                namedExport: true,
                                localIdentName: '[name]__[local]__[hash:base64:5]'
                            },
                            url: false
                        }
                    },
                    'group-css-media-queries-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[name][contenthash][ext]'
                }
            },
            {
                test: /\.(?:js|mjs|cjs)$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', { targets: 'defaults' }]]
                    }
                }
            },
            {
                test: /\.(mov|mp4)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/videos/[name][contenthash][ext]',
                },
            },
        ]
    }
};
