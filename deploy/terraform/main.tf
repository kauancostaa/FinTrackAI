# AWS Infrastructure for FinTrackAI
terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_db_instance" "database" {
  engine         = "sqlserver-ex"
  instance_class = "db.t3.medium"
  allocated_storage = 50
}

resource "aws_eks_cluster" "kubernetes" {
  name = "fintrackai-cluster"
}
