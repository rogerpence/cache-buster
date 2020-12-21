module.exports = {
    plugins: [
        require('cssnano')({
            preset: 'default'
        }),
        require('@fullhuman/postcss-purgecss')({
            content: ['./dist/**/*.html']
        }),
    ],
};