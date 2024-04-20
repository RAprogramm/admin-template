# Rust Admin

<!--toc:start-->

- [Structure](#structure)
- [Usage](#usage)
<!--toc:end-->

---

## Structure

```
Rust Admin
│
├── back
│   ├── migrations
│   └── src
│       ├── database
│       ├── dtos
│       ├── extractors
│       ├── handlers
│       │   ├── articles
│       │   ├── auth
│       │   ├── files
│       │   ├── projects
│       │   └── users
│       ├── models
│       └── utils
└── front
    ├── public
    └── src
        ├── api
        │   ├── services
        │   └── types
        ├── assets
        ├── images
        ├── components
        │   ├── header
        │   └── modals
        ├── layouts
        ├── pages
        │   ├── articlesPages
        │   ├── authPages
        │   ├── projectsPages
        │   └── usersPages
        ├── router
        ├── schemas
        ├── store
        └── utils
```

---


## Usage

### 1.  turn ON postgres service

```sh
systemctl start postgresql.service
```

### 2.  run backend

> [!IMPORTANT]
> IN `back` DIRECTORY

> [!TIP]
> > - to install sqlx
> >
> > ```sh
> > make install_sqlx
> > ```
>
> > - to make database migrations
> >
> > ```sh
> > make db_migrate
> > ```
>
> > - to revert database migrations (if needed)
> >
> > ```sh
> > make db_revert
> > ```
>
> > - to start server
> >
> > ```sh
> > make start
> > ```
>
> Go to [swagerUI](http://localhost:8000)

### 3.  run frontend

> [!IMPORTANT]
> IN `front` DIRECTORY

> [!TIP]
> > - to install all dependencies from package.json
> >
> > ```sh
> > yarn
> > ```
>
> > - to start server
> >
> > ```sh
> > yarn dev
> > ```
>
   > Go to [RustAdmin](http://localhost:3000)
