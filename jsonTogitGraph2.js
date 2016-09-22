var JSONbranches = [
  {
    "name": "dev",
    "commit": {
      "sha": "453e2c9462895b8b310eaf729821180b1ef4f60b",
    }
  },
  {
    "name": "master",
    "commit": {
      "sha": "56d20161b7aae27c3e5632a4ea6a7e73db1457ed",
    }
  }
];

var JSONcommits = [
    {
        "sha": "453e2c9462895b8b310eaf729821180b1ef4f60b",
        "commit": {

            "message": "Feat/npm script (#9)\n\n* (feat, npmLint) add npm lint script to be able to run eslint on all .js files\r\n\r\n* (feat, npmLint ) add npm lint script, remove linebreak-style from .eslintrc",

        },
        "parents": [
            {
                "sha": "a5b67aa6f82dd87af0441f5c3785946ef7fd8f1d",
            }
        ]
    },
    {
        "sha": "a5b67aa6f82dd87af0441f5c3785946ef7fd8f1d",
        "commit": {

            "message": "Merge pull request #7 from cadeban/commandFeat\n\nFeat(gitCommands)/remove modified gitGraph lib from gitignore file",

        },

        "parents": [
            {
                "sha": "db157b4ef84473925dc9574785e21d10adfd7559",
            },
            {
                "sha": "0ad2da1cc874caf375993b164d57d617d14aa0ca",
            }
        ]
    },
    {
        "sha": "0ad2da1cc874caf375993b164d57d617d14aa0ca",
        "commit": {
            "author": {
                "name": "Cadence Banulis",
                "email": "cbanulis@icloud.com",
            },
            "committer": {
                "name": "Cadence Banulis",
                "email": "cbanulis@icloud.com",
            },
            "message": "refactor(gitGraph) remove modified gitGraph from gitignore",
            "tree": {
                "sha": "ba844678e269a20af2ddb8567e8be514adc2d9cb",
            },
            "comment_count": 0
        },
        "author": {
            "login": "cadeban",
            "id": 7953060,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "cadeban",
            "id": 7953060,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": [
            {
                "sha": "595092271fba9195be2179e4e2a9f1adb4db9e82",
            },
            {
                "sha": "4fa84d6d5b0ccc659447ad60ccfdc2292daa6717",
            }
        ]
    },
    {
        "sha": "db157b4ef84473925dc9574785e21d10adfd7559",
        "commit": {
            "author": {
                "name": "timoweave",
                "email": "timoweave@users.noreply.github.com",
            },
            "committer": {
                "name": "arnav-aggarwal",
                "email": "arnavaggrwl@gmail.com",
            },
            "message": "(feat, setup) add makeGitGraph martin/tim (#6)",
            "tree": {
                "sha": "5e49ad347b60a04fbecab437d3ca7b80bd789405",
            },
            "comment_count": 0
        },
        "author": {
            "login": "timoweave",
            "id": 13225610,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "arnav-aggarwal",
            "id": 19792993,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": [
            {
                "sha": "4fa84d6d5b0ccc659447ad60ccfdc2292daa6717",
            }
        ]
    },
    {
        "sha": "4fa84d6d5b0ccc659447ad60ccfdc2292daa6717",
        "commit": {
            "author": {
                "name": "cadeban",
                "email": "cbanulis@icloud.com",
            },
            "committer": {
                "name": "arnav-aggarwal",
                "email": "arnavaggrwl@gmail.com",
            },
            "message": "Feat(gitCommands)/hardcode universal git commands (#5)\n\n* feat(gitCommands) add git commands property to commit object in gitGraph lib\r\n\r\n* feat(gitCommands) hardcode universal git commands",
            "tree": {
                "sha": "bce0bfad7e5ef878028a7745fc82f948724374a9",
            },
            "comment_count": 0
        },
        "author": {
            "login": "cadeban",
            "id": 7953060,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "arnav-aggarwal",
            "id": 19792993,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": [
            {
                "sha": "520939a449957d806a1d00bdb262f345d78b6948",
            }
        ]
    },
    {
        "sha": "595092271fba9195be2179e4e2a9f1adb4db9e82",
        "commit": {
            "author": {
                "name": "Cadence Banulis",
                "email": "cbanulis@icloud.com",
            },
            "committer": {
                "name": "Cadence Banulis",
                "email": "cbanulis@icloud.com",
            },
            "message": "feat(gitCommands) hardcode universal git commands",
            "tree": {
                "sha": "bce0bfad7e5ef878028a7745fc82f948724374a9",
            },
            "comment_count": 0
        },
        "author": {
            "login": "cadeban",
            "id": 7953060,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "cadeban",
            "id": 7953060,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": [
            {
                "sha": "abee56e0706520a2f076e62b028a63bd52f90aa8",
            }
        ]
    },
    {
        "sha": "abee56e0706520a2f076e62b028a63bd52f90aa8",
        "commit": {
            "author": {
                "name": "Cadence Banulis",
                "email": "cbanulis@icloud.com",
            },
            "committer": {
                "name": "Cadence Banulis",
                "email": "cbanulis@icloud.com",
            },
            "message": "feat(gitCommands) add git commands property to commit object in gitGraph lib",
            "tree": {
                "sha": "bad843350a2c4a4dfba0cb58e370067d3f753cee",
            },
            "comment_count": 0
        },
        "author": {
            "login": "cadeban",
            "id": 7953060,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "cadeban",
            "id": 7953060,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": [
            {
                "sha": "520939a449957d806a1d00bdb262f345d78b6948",
            }
        ]
    },
    {
        "sha": "520939a449957d806a1d00bdb262f345d78b6948",
        "commit": {
            "author": {
                "name": "arnav-aggarwal",
                "email": "arnavaggrwl@gmail.com",
            },
            "committer": {
                "name": "cadeban",
                "email": "cbanulis@icloud.com",
            },
            "message": "Feat(renderGraph)/Demo repo renders to page\n\n* (feat, renderGraph) Render demo graph to page.\r\n\r\nCreate a new file with our own demo graph.\r\nEdit README.md formatting.\r\nPoint index.html to new practice js file.\r\n\r\n* (refactor, renderGraph) Remove useless comments\r\n\r\n* refactor(renderGraph) Create makeConfig function",
            "tree": {
                "sha": "a2b79e20f1d8f4b091088c168a6db5f348efc2b1",
            },
            "comment_count": 0
        },
        "author": {
            "login": "arnav-aggarwal",
            "id": 19792993,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "cadeban",
            "id": 7953060,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": [
            {
                "sha": "c70bb495988532b3a58ac32762437e70ac0d9d27",
            }
        ]
    },
    {
        "sha": "c70bb495988532b3a58ac32762437e70ac0d9d27",
        "commit": {
            "author": {
                "name": "cadeban",
                "email": "cbanulis@icloud.com",
            },
            "committer": {
                "name": "GitHub",
                "email": "noreply@github.com",
            },
            "message": "Merge pull request #3 from arnav-aggarwal/doc/_contributing.md\n\n(doc, README) Format readme title",
            "tree": {
                "sha": "8ed1dc0bd8931c2d040f52a1b9cefb5a505763ae",
            },
            "comment_count": 0
        },
        "author": {
            "login": "cadeban",
            "id": 7953060,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "web-flow",
            "id": 19864447,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": [
            {
                "sha": "02a9282cab083f9a8d8d0d6e026aba8ca6debedf",
            },
            {
                "sha": "d5e1464d4d2c49d066ca2c106a9456e9236046fb",
            }
        ]
    },
    {
        "sha": "d5e1464d4d2c49d066ca2c106a9456e9236046fb",
        "commit": {
            "author": {
                "name": "Arnav Aggarwal",
                "email": "arnavaggrwl@gmail.com",
            },
            "committer": {
                "name": "Arnav Aggarwal",
                "email": "arnavaggrwl@gmail.com",
            },
            "message": "(doc, README) Format readme title",
            "tree": {
                "sha": "8ed1dc0bd8931c2d040f52a1b9cefb5a505763ae",
            },
            "comment_count": 0
        },
        "author": {
            "login": "arnav-aggarwal",
            "id": 19792993,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "arnav-aggarwal",
            "id": 19792993,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": [
            {
                "sha": "a3d1f5ffc99828cf0e3bcd233cdb2375749ce24d",
            }
        ]
    },
    {
        "sha": "02a9282cab083f9a8d8d0d6e026aba8ca6debedf",
        "commit": {
            "author": {
                "name": "Martin Kwan",
                "email": "martinkkwan@gmail.com",
            },
            "committer": {
                "name": "GitHub",
                "email": "noreply@github.com",
            },
            "message": "Merge pull request #2 from arnav-aggarwal/doc/_contributing.md\n\n(doc, _contributing.md) Add contribution guide",
            "tree": {
                "sha": "1f10f6dc6c9ea53cf6ebfbb0b94df98031bcc755",
            },
            "comment_count": 0
        },
        "author": {
            "login": "martinkwan",
            "id": 13195630,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "web-flow",
            "id": 19864447,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": [
            {
                "sha": "5be45f11a0176715f8b1b83537ae03fa586776d8",
            },
            {
                "sha": "a3d1f5ffc99828cf0e3bcd233cdb2375749ce24d",
            }
        ]
    },
    {
        "sha": "a3d1f5ffc99828cf0e3bcd233cdb2375749ce24d",
        "commit": {
            "author": {
                "name": "Arnav Aggarwal",
                "email": "arnavaggrwl@gmail.com",
            },
            "committer": {
                "name": "Arnav Aggarwal",
                "email": "arnavaggrwl@gmail.com",
            },
            "message": "(doc, README) Add readme",
            "tree": {
                "sha": "1f10f6dc6c9ea53cf6ebfbb0b94df98031bcc755",
            },
            "comment_count": 0
        },
        "author": {
            "login": "arnav-aggarwal",
            "id": 19792993,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "arnav-aggarwal",
            "id": 19792993,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": [
            {
                "sha": "a51549a46df969384b3989cb3c27cd7ac002ba87",
            }
        ]
    },
    {
        "sha": "a51549a46df969384b3989cb3c27cd7ac002ba87",
        "commit": {
            "author": {
                "name": "Arnav Aggarwal",
                "email": "arnavaggrwl@gmail.com",
            },
            "committer": {
                "name": "Arnav Aggarwal",
                "email": "arnavaggrwl@gmail.com",
            },
            "message": "(doc, _contributing.md) Add contribution guide",
            "tree": {
                "sha": "2cc9f6437b905ca7e8716f33ca14d5f4789c3468",
            },
            "comment_count": 0
        },
        "author": {
            "login": "arnav-aggarwal",
            "id": 19792993,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "arnav-aggarwal",
            "id": 19792993,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": [
            {
                "sha": "5be45f11a0176715f8b1b83537ae03fa586776d8",
            }
        ]
    },
    {
        "sha": "5be45f11a0176715f8b1b83537ae03fa586776d8",
        "commit": {
            "author": {
                "name": "Martin Kwan",
                "email": "martinkkwan@gmail.com",
            },
            "committer": {
                "name": "GitHub",
                "email": "noreply@github.com",
            },
            "message": "Merge pull request #1 from arnav-aggarwal/init\n\nfeat, setup/Boilerplate setup",
            "tree": {
                "sha": "f5a5c7cea2ecaf09727909c20d5fcac745a8fc0f",
            },
            "comment_count": 0
        },
        "author": {
            "login": "martinkwan",
            "id": 13195630,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "web-flow",
            "id": 19864447,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": [
            {
                "sha": "56d20161b7aae27c3e5632a4ea6a7e73db1457ed",
            },
            {
                "sha": "589d02068ca8b4bfb8135d25630a0ef237f63bf0",
            }
        ]
    },
    {
        "sha": "589d02068ca8b4bfb8135d25630a0ef237f63bf0",
        "commit": {
            "author": {
                "name": "Arnav Aggarwal",
                "email": "arnavaggrwl@gmail.com",
            },
            "committer": {
                "name": "Arnav Aggarwal",
                "email": "arnavaggrwl@gmail.com",
            },
            "message": "(doc, setup) Change package.json project name",
            "tree": {
                "sha": "f5a5c7cea2ecaf09727909c20d5fcac745a8fc0f",
            },
            "comment_count": 0
        },
        "author": {
            "login": "arnav-aggarwal",
            "id": 19792993,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "arnav-aggarwal",
            "id": 19792993,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": [
            {
                "sha": "6471a0b8c75c7c78b77a87527770b103b534e788",
            }
        ]
    },
    {
        "sha": "6471a0b8c75c7c78b77a87527770b103b534e788",
        "commit": {
            "author": {
                "name": "Arnav Aggarwal",
                "email": "arnavaggrwl@gmail.com",
            },
            "committer": {
                "name": "Arnav Aggarwal",
                "email": "arnavaggrwl@gmail.com",
            },
            "message": "(feat, setup) Boilerplate setup",
            "tree": {
                "sha": "736e9e67d5c85d818858aa1034413108c8e45843",
            },
            "comment_count": 0
        },
        "author": {
            "login": "arnav-aggarwal",
            "id": 19792993,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "arnav-aggarwal",
            "id": 19792993,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": [
            {
                "sha": "56d20161b7aae27c3e5632a4ea6a7e73db1457ed",
            }
        ]
    },
    {
        "sha": "56d20161b7aae27c3e5632a4ea6a7e73db1457ed",
        "commit": {
            "author": {
                "name": "Martin Kwan",
                "email": "martinkkwan@gmail.com",
            },
            "committer": {
                "name": "Martin Kwan",
                "email": "martinkkwan@gmail.com",
            },
            "message": "Initial commit",
            "tree": {
                "sha": "28d84a8e461a681cb95a393a720543e08627bc08",
            },
            "comment_count": 0
        },
        "author": {
            "login": "martinkwan",
            "id": 13195630,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "committer": {
            "login": "martinkwan",
            "id": 13195630,
            "gravatar_id": "",
            "type": "User",
            "site_admin": false
        },
        "parents": []
    }
]

let githubTranslator = new GithubApiInterface(JSONcommits, JSONbranches);
JSONcommits = githubTranslator.JSONCommits;
console.log(githubTranslator.SHALookup,"??");
var SHALookup = githubTranslator.SHALookup;
