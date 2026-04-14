#include "consulter_liste.h"
#include "ui_consulter_liste.h"

consulter_liste::consulter_liste(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::consulter_liste)
{
    ui->setupUi(this);
}

consulter_liste::~consulter_liste()
{
    delete ui;
}
