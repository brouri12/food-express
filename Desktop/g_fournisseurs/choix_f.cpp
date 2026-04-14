#include "choix_f.h"
#include "ui_choix_f.h"

choix_f::choix_f(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::choix_f)
{
    ui->setupUi(this);
}

choix_f::~choix_f()
{
    delete ui;
}
