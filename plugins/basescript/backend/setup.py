#!/usr/bin/env python
import os
from setuptools import find_packages, setup

PROJECT_DIR = os.path.dirname(__file__)
REQUIREMENTS_DIR = os.path.join(PROJECT_DIR, "requirements")
VERSION = "0.0.1"


def get_requirements(env):
    with open(os.path.join(REQUIREMENTS_DIR, f"{env}.txt")) as fp:
        return [
            x.strip()
            for x in fp.read().split("\n")
            if not x.strip().startswith("#") and not x.strip().startswith("-")
        ]


install_requires = get_requirements("base")

setup(
    name="basescript",
    version=VERSION,
    url="https://github.com/Raudius/basescript",
    author="R. Ferreira Fuentes",
    author_email="r.ferreira.fuentes@gmail.com",
    license="AGPL-3.0",
    description="A scripting application for baserow",
    long_description="Basescript allows you to write short JavaScript-based scripts to perform operations on your "
                     "baserow workspaces.",
    platforms=["linux"],
    package_dir={"": "src"},
    packages=find_packages("src"),
    include_package_data=True,
    install_requires=install_requires
)
