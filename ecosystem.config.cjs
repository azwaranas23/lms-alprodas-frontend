module.exports = {
    apps: [
        {
            name: "lms-alprodas-frontend",
            cwd: "/opt/alprodas/frontend",
            script: "npx",
            args: "react-router-serve ./build/server/index.js",
            env: {
                PORT: 5173,
                NODE_ENV: "production"
            }
        }
    ]
}
